**{{ include.args.title | default: "방송 정보" | escape }}**

| 항목 | 내용 |
| :--- | :--- |
| 플랫폼 | {{ include.args.platform | default: "미기재" }} |
| 진행 시기 | {{ include.args.period | default: "미기재" }} |
{% if include.args.note %}| 비고 | {{ include.args.note }} |{% endif %}
