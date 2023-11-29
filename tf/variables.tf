## auth0
variable "auth0_domain" {
  type = string
  description = "Auth0 Domain"
}

variable "auth0_tf_client_id" {
  type = string
  description = "Auth0 TF provider client_id"
}

variable "auth0_tf_client_secret" {
  type = string
  description = "Auth0 TF provider client_secret"
  sensitive = true
}

variable "default_password" {
  type = string
  description = "password for test users"
  sensitive = true
}

## vercel
variable "vercel_api_token" {
  type = string
  description = "vercel token"
  sensitive = true
}

variable "beans_blend_subdomain" {
  type = string
  default = "beans-blend"
}

variable "fizzy_fusion_subdomain" {
  type = string
  default = "fizzy-fusion"
}

variable "drinks_co_subdomain" {
  type = string
  default = "drinks-co"
}

## mailtrap
variable "mailtrap_smtp_user" {
  type = string
}

variable "mailtrap_smtp_pass" {
  type = string
  sensitive = true
}