#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
output_argument=${1:-git-tracked-files.zip}
case $output_argument in
  /*) output_path=$output_argument ;;
  *) output_path=$repo_root/$output_argument ;;
esac

cd "$repo_root"

mkdir -p "$(dirname "$output_path")"

git ls-files -z | xargs -0 -n 1000000 sh -c '
  output_path=$1
  shift

  rm -f "$output_path"

  found=0
  for file do
    [ -e "$file" ] || continue
    zip -q "$output_path" "$file"
    found=1
  done

  if [ "$found" -eq 0 ]; then
    printf "%s\n" "No tracked files were found to archive." >&2
    exit 1
  fi
' sh "$output_path"

printf 'Created %s\n' "${output_path#$repo_root/}"