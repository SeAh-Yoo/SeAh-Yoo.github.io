**{{ include.args.title }}**
{% if include.args.subtitle %}
{{ include.args.subtitle }}
{% endif %}

{% if include.args.period %}
- **활동 기간:** {{ include.args.period }}
{% endif %}
- **소속 인원:** {{ include.args.members }}

{{ include.args.body }}
