#!/usr/bin/env bash
# gemini-image-ref.sh — call Nano Banana Pro (gemini-3-pro-image-preview) with
# a text prompt + optional reference image, save the returned image as PNG.
#
# Usage:
#   gemini-image-ref.sh \
#     --prompt   "<text>" \
#     --output   "<path/to/image.png>" \
#     [--aspect    "1:1" | "4:5" | "9:16" | "16:9" | "3:4" | "4:3"] \
#     [--reference "<path/to/reference.jpg>"]
#
# Requires:
#   - GEMINI_API_KEY in env
#   - perl (with core JSON::PP + MIME::Base64 — both ship with modern Perl,
#     including Git Bash / MSYS2 on Windows)
#   - curl
#
# Exit codes:
#   0   success (PNG written to --output)
#   1   missing arg / missing env / response parse error
#   2   HTTP error from API (HTTP code printed on stderr as "HTTP_CODE: NNN")

set -euo pipefail

PROMPT=""
ASPECT="1:1"
OUTPUT=""
REFERENCE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prompt)    PROMPT="${2:-}";    shift 2 ;;
    --aspect)    ASPECT="${2:-1:1}"; shift 2 ;;
    --output)    OUTPUT="${2:-}";    shift 2 ;;
    --reference) REFERENCE="${2:-}"; shift 2 ;;
    -h|--help)
      sed -n '2,20p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "GEMINI_API_KEY is not set" >&2
  exit 1
fi
if [[ -z "$PROMPT" ]]; then
  echo "--prompt is required" >&2
  exit 1
fi
if [[ -z "$OUTPUT" ]]; then
  echo "--output is required" >&2
  exit 1
fi
if [[ -n "$REFERENCE" && ! -f "$REFERENCE" ]]; then
  echo "--reference file not found: $REFERENCE" >&2
  exit 1
fi

REQUEST_FILE="$(mktemp)"
RESPONSE_FILE="$(mktemp)"
trap 'rm -f "$REQUEST_FILE" "$RESPONSE_FILE"' EXIT

# Build the JSON request body in Perl. JSON::PP handles all string escaping;
# MIME::Base64 reads the reference image as binary and emits unwrapped base64.
PROMPT="$PROMPT" \
ASPECT="$ASPECT" \
REFERENCE="$REFERENCE" \
REQUEST_FILE="$REQUEST_FILE" \
perl -e '
  use strict;
  use warnings;
  use JSON::PP;
  use MIME::Base64 qw(encode_base64);
  use Encode qw(decode_utf8);

  # Env vars arrive as raw bytes; decode them to Perl unicode strings so
  # JSON::PP->utf8->encode does not double-encode multi-byte characters.
  my $prompt_text = decode_utf8($ENV{PROMPT});
  my $aspect      = decode_utf8($ENV{ASPECT});

  my @parts = ({ text => $prompt_text });

  if (defined $ENV{REFERENCE} && length $ENV{REFERENCE}) {
    my $path = $ENV{REFERENCE};
    open(my $fh, "<", $path) or die "open $path: $!";
    binmode $fh;
    local $/;
    my $bytes = <$fh>;
    close $fh;

    my $b64 = encode_base64($bytes, "");
    my $mime = "image/png";
    if    ($path =~ /\.jpe?g$/i) { $mime = "image/jpeg"; }
    elsif ($path =~ /\.webp$/i)  { $mime = "image/webp"; }
    elsif ($path =~ /\.gif$/i)   { $mime = "image/gif";  }

    push @parts, { inline_data => { mime_type => $mime, data => $b64 } };
  }

  my %body = (
    contents => [ { parts => \@parts } ],
    generationConfig => {
      responseModalities => [ "IMAGE" ],
      imageConfig        => { aspectRatio => $aspect },
    },
  );

  open(my $out, ">", $ENV{REQUEST_FILE}) or die "open $ENV{REQUEST_FILE}: $!";
  binmode $out;
  print $out JSON::PP->new->utf8->encode(\%body);
  close $out;
'

URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}"

# Pull HTTP code separately so we can distinguish 500s for the retry pass.
HTTP_CODE="$(curl -sS -o "$RESPONSE_FILE" -w "%{http_code}" \
  -X POST "$URL" \
  -H "Content-Type: application/json" \
  --data-binary "@$REQUEST_FILE" || echo "000")"

echo "HTTP_CODE: $HTTP_CODE" >&2

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "API error from gemini-3-pro-image-preview" >&2
  # Print the first 2KB of the response for context but don't flood the log.
  head -c 2048 "$RESPONSE_FILE" >&2 || true
  echo "" >&2
  exit 2
fi

# Make sure the output directory exists.
OUT_DIR="$(dirname "$OUTPUT")"
mkdir -p "$OUT_DIR"

# Decode the first inline image part from the response and write it to OUTPUT.
RESPONSE_FILE="$RESPONSE_FILE" \
OUTPUT="$OUTPUT" \
perl -e '
  use strict;
  use warnings;
  use JSON::PP;
  use MIME::Base64 qw(decode_base64);

  open(my $fh, "<", $ENV{RESPONSE_FILE}) or die "open $ENV{RESPONSE_FILE}: $!";
  binmode $fh;
  local $/;
  my $body = <$fh>;
  close $fh;

  my $resp;
  eval { $resp = JSON::PP->new->utf8->decode($body); 1 }
    or do {
      print STDERR "Failed to parse JSON response\n";
      print STDERR substr($body, 0, 2000), "\n";
      exit 1;
    };

  my $cands = $resp->{candidates} || [];
  for my $c (@$cands) {
    my $parts = ($c->{content} && $c->{content}->{parts}) || [];
    for my $p (@$parts) {
      my $inline = $p->{inline_data} // $p->{inlineData};
      next unless $inline && $inline->{data};
      open(my $out, ">", $ENV{OUTPUT}) or die "open $ENV{OUTPUT}: $!";
      binmode $out;
      print $out decode_base64($inline->{data});
      close $out;
      exit 0;
    }
  }

  print STDERR "No inline image data in response\n";
  print STDERR substr($body, 0, 2000), "\n";
  exit 1;
'

echo "Saved: $OUTPUT" >&2
