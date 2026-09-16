<div class="wiki-organization" role="region" tabindex="0" aria-label="{{ include.args.title | escape }} 명단 (좁은 화면에서 가로 스크롤)" data-org-source="{{ include.args.source | escape }}" data-org-layout="{{ include.args.layout | default: include.layout | default: 'citizen' | escape }}" data-org-kind="{{ include.kind | default: 'organization' | escape }}" data-org-title="{{ include.args.title | escape }}" data-org-icon="{{ include.icon | default: include.args.icon | default: 'organization' | escape }}" data-org-subtitle="{{ include.args.subtitle | escape }}" data-org-period="{{ include.args.period | escape }}" data-org-status="{{ include.args.status | escape }}" data-org-as-of="{{ include.args.as_of | escape }}" data-org-baseurl="{{ site.baseurl | escape }}" markdown="1">

{{ include.args.body }}

</div>
{% if include.args.details %}
<div class="wiki-organization-details" markdown="1">

{{ include.args.details }}

</div>
{% endif %}
