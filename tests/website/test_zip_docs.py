"""Documentation export archives preserve pages, payloads and resources."""

from importlib import import_module
from zipfile import ZIP_DEFLATED, ZipFile

archive = import_module('website.scripts.zip-docs').archive


def test_archive_preserves_deployment_paths_and_binary_bytes(tmp_path):
    root = tmp_path / 'deployment'
    page = root / 'docs' / 'guide'
    page.mkdir(parents=True)
    html = b'<h1>Original page</h1>\n'
    payload = b'0:{"original":true}\n'
    binary = bytes(range(256)) * 64
    (page / 'index.html').write_bytes(html)
    (page / 'index.txt').write_bytes(payload)
    (root / 'docs' / 'download.bin').write_bytes(binary)
    (root / '.nojekyll').write_bytes(b'')
    output = tmp_path / 'build' / 'docs.zip'

    archive(root, output)

    with ZipFile(output) as zipped:
        assert zipped.read('docs/guide/index.html') == html
        assert zipped.read('docs/guide/index.txt') == payload
        assert zipped.read('docs/download.bin') == binary
        assert zipped.read('.nojekyll') == b''
        assert zipped.getinfo('docs/download.bin').compress_type == ZIP_DEFLATED
        assert zipped.getinfo('docs/download.bin').compress_size < len(binary)
