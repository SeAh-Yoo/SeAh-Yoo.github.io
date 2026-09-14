{% case include.args.department %}
{% when '시청' %}{% assign ranks = '시장,공무원' | split: ',' %}{% assign department_class = 'city' %}
{% when '경찰' %}{% assign ranks = '청장,서장,경정,경감,경위,경사,경장,순경,교육생' | split: ',' %}{% assign department_class = 'police' %}
{% when '병원' %}{% assign ranks = '병원장,부원장,총괄실장,진료부장,응급부장,수석응급구조사,응급구조사,인턴' | split: ',' %}{% assign department_class = 'hospital' %}
{% when '방송국' %}{% assign ranks = '편집국장,부장,선임기자,수석기자,기자,견습' | split: ',' %}{% assign department_class = 'broadcast' %}
{% when '교통정비공사' %}{% assign ranks = '사장,실장,고위기사,모범기사,일반기사,수습기사' | split: ',' %}{% assign department_class = 'transport' %}
{% endcase %}

| 직위 | 인원 |
| :--- | :--- |
{% for rank in ranks %}{% assign rank_key = 'rank_' | append: forloop.index %}| {{ rank }} | {{ include.args[rank_key] | default: '-' | strip }} |
{% endfor %}{: .wiki-service-table .wiki-service-{{ department_class }} }
