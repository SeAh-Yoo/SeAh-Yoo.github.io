{% case include.args.department %}
{% when '시청' %}{% assign ranks = '시장,공무원' | split: ',' %}{% assign department_class = 'city' %}
{% when '경찰' %}{% assign ranks = '청장,서장,경정,경감,경위,경사,경장,순경,교육생' | split: ',' %}{% assign department_class = 'police' %}
{% when '병원' %}{% assign ranks = '병원장,부원장,총괄실장,진료부장,응급부장,수석응급구조사,응급구조사,인턴' | split: ',' %}{% assign department_class = 'hospital' %}
{% when '방송국' %}{% assign ranks = '편집국장,부장,선임기자,수석기자,기자,견습' | split: ',' %}{% assign department_class = 'broadcast' %}
{% when '교통정비공사' %}{% assign ranks = '사장,실장,고위기사,모범기사,일반기사,수습기사' | split: ',' %}{% assign department_class = 'transport' %}
{% endcase %}
{% assign service_total = 0 %}
{% assign service_guides = 0 %}
{% for rank in ranks %}
{% assign rank_key = 'rank_' | append: forloop.index %}
{% assign rank_members = include.args[rank_key] | default: '' | strip | replace: '<br />', '<br>' | replace: '<br/>', '<br>' | split: '<br>' %}
{% for member in rank_members %}
{% assign member = member | strip %}
{% if member != '' and member != '-' %}
{% assign service_total = service_total | plus: 1 %}
{% if member contains '[+가이드]' or member contains '[+운영자]' %}{% assign service_guides = service_guides | plus: 1 %}{% endif %}
{% endif %}
{% endfor %}
{% endfor %}
{% assign service_players = service_total | minus: service_guides %}

| 직위 | 인원 |
| :--- | :--- |
{% for rank in ranks %}{% assign rank_key = 'rank_' | append: forloop.index %}| {{ rank }} | {{ include.args[rank_key] | default: '-' | strip }} |
{% endfor %}| **인원 합계** | **{{ service_total }}명** (명단 기준: 참가자 {{ service_players }}명, 가이드·운영자 {{ service_guides }}명) |
{: .wiki-service-table .wiki-service-{{ department_class }} }
