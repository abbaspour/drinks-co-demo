{% case application.clientID %}
    %{ for clientID, email in config ~}
    {% when "${clientID}" %}
${email}
    %{ endfor ~}
    {% else %}
    <!-- generic template -->
${generic }
{% endcase %}
