"""Write the deployment archive incrementally, including ZIP64 for large sites."""

from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


def archive(directory: Path, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=6, allowZip64=True) as zipped:
        for path in sorted(directory.rglob('*')):
            if path.is_file():
                zipped.write(path, path.relative_to(directory).as_posix())


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    archive(args.directory, args.output)
