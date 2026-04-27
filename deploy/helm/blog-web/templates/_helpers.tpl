{{- define "blog-web.name" -}}blog-web{{- end -}}
{{- define "blog-web.fullname" -}}{{ include "blog-web.name" . }}{{- end -}}
{{- define "blog-web.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "blog-web.fullname" .) .Values.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}
