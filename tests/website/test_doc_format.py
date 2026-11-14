"""Documentation syntax conversion must not change executable or inline examples."""

from website.scripts.doc_format import convert_document


def test_nested_callouts_preserve_code_and_inline_examples():
    code = "```html\n<head><!-- literal example --></head>\n```\n"
    inline = "`<!-- literal comment -->` and `%%APP_NAME%%\nNAME`"
    text = f":::warning Keep [this reference](./reference.md)\n\n{inline}\n\n:::note\n{code}:::\n:::\n"
    converted = convert_document(text)
    assert code in converted
    assert inline in converted
    assert "Keep [this reference](./reference.md)" in converted
    assert converted.index("<Warning>") < converted.index("<Note>") < converted.index("</Note>") < converted.index("</Warning>")


def test_frontmatter_and_nonrendered_information_are_retained():
    text = (
        '---\ntitle: "Original title"\ndescription: "Original description"\n'
        'sidebar_label: "Original label"\nsidebar_position: 3\n---\n\n'
        '<!-- original supporting information -->\n\n# Original heading {#original-id}\n'
    )
    converted = convert_document(text)
    assert 'title: "Original title"' in converted
    assert 'description: "Original description"' in converted
    assert 'sidebarTitle: "Original label"' in converted
    assert '{/* original supporting information */}' in converted
    assert '# Original heading {#original-id}' in converted


def test_bracket_callout_titles_and_nested_examples_are_preserved():
    text = ':::warning[Exact original title]\nOriginal paragraph.\n\n```md\n:::note[Literal directive]\n::: \n```\n:::\n'
    result = convert_document(text)
    assert '<Warning>' in result
    assert 'Exact original title' in result
    assert 'Original paragraph.' in result
    assert '```md\n:::note[Literal directive]\n::: \n```' in result
    assert '</Warning>' in result
