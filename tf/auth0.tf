locals {
  beans_blend_domain = "${var.beans_blend_subdomain}.vercel.app"
  fizzy_fusion_domain = "${var.fizzy_fusion_subdomain}.vercel.app"
  drinks_co_domain = "${var.fizzy_fusion_subdomain}.vercel.app"
}

resource "auth0_tenant" "tenant_config" {
  friendly_name = "Drinks Co Branding Demo"
  default_redirection_uri = "https://${local.drinks_co_domain}"

  flags {
    enable_client_connections = false
  }
}

# Users DB
resource "auth0_connection" "users" {
  name = "Users"
  strategy = "auth0"

  options {
    requires_username = false
    password_policy = "low"
    disable_signup = false
    brute_force_protection = true
  }
}

# Beans Blend client
resource "auth0_client" "beans_blend" {
  name = "Beans Blend"
  description = "Beans Blend SPA client"
  app_type = "spa"
  oidc_conformant = true
  is_first_party = true
  logo_uri = "https://drinks-co.vercel.app/img/beans-blend-logo.png"

  callbacks = [
    "https://jwt.io",
    "https://${local.beans_blend_domain}"
  ]

  allowed_logout_urls = [
    "https://${local.beans_blend_domain}"
  ]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "local_file" "beans_blend_config" {
  content  = <<EOF
{
  "domain": "${var.auth0_domain}",
  "clientId": "${auth0_client.beans_blend.client_id}",
  "audience": ""
}
EOF
  filename = "../apps/beans-blend/src/auth_config.json"
}

# Fizzy fusion client
resource "auth0_client" "fizzy_fusion" {
  name = "Fizzy Fusion"
  description = "Fizzy Fusion SPA client"
  app_type = "spa"
  oidc_conformant = true
  is_first_party = true
  logo_uri = "https://drinks-co.vercel.app/img/fizzy-fusion-logo.png"

  callbacks = [
    "https://jwt.io",
    "https://${local.fizzy_fusion_domain}"
  ]

  allowed_logout_urls = [
    "https://${local.fizzy_fusion_domain}"
  ]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "local_file" "fizzy_fusion_config" {
  content  = <<EOF
{
  "domain": "${var.auth0_domain}",
  "clientId": "${auth0_client.fizzy_fusion.client_id}"
}
EOF
  filename = "../apps/fizzy-fusion/auth_config.json"
}


# Central DB
resource "auth0_connection_clients" "brands_central_user_store" {
  connection_id   = auth0_connection.users.id
  enabled_clients = [auth0_client.beans_blend.id, auth0_client.fizzy_fusion.id, var.auth0_tf_client_id]
}

resource "auth0_branding" "brand" {
  logo_url = "https://drinks-co.vercel.app/img/drinks-co-logo.png"
  colors {
    primary         = "#B0BEC5"
    page_background = "#0D47A1"
  }
}

resource "auth0_pages" "classic" {
  login {
    enabled = true
    html    = file("../ul/dist/index.html")
  }
}


## Users
resource "auth0_user" "user_1" {
  depends_on = [auth0_connection_clients.brands_central_user_store]
  connection_name = auth0_connection.users.name
  email = "user1@atko.email"
  password = var.default_password
}

resource "auth0_user" "user_2" {
  depends_on = [auth0_connection_clients.brands_central_user_store]
  connection_name = auth0_connection.users.name
  email = "user2@atko.email"
  password = var.default_password
}

## Email Server
resource "auth0_email_provider" "mailtrap" {
  name = "smtp"
  enabled = true
  default_from_address = "noreply@drinks.co"
  credentials {
    smtp_host = "sandbox.smtp.mailtrap.io"
    smtp_port = 2525
    smtp_user = var.mailtrap_smtp_user
    smtp_pass = var.mailtrap_smtp_pass
  }
}

## outputs
output "beans_blend_login_url" {
  value = "https://${var.auth0_domain}/authorize?client_id=${auth0_client.beans_blend.id}&redirect_uri=https://jwt.io&response_type=id_token&connection=Users&nonce=nonce&prompt=login"
}

output "fizzy_fusion_client_id" {
  value = auth0_client.fizzy_fusion.id
}