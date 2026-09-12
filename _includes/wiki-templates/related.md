**{{ include.args.title | default: "관련 항목" | escape }}**

- [위키 전체 색인]({{ '/wiki/' | relative_url }})
{% if include.args.links %}{{ include.args.links }}{% endif %}
