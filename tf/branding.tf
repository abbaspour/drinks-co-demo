## CSS
# Beans Blend
resource "local_file" "beans_blend_css" {
  content  = file("../css/beans-blend.css")
  filename = "../public/css/${auth0_client.beans_blend.client_id}.css"
}

# Fizzy Fusion
resource "local_file" "fizzy_fusion_css" {
  content  = file("../css/fizzy-fusion.css")
  filename = "../public/css/${auth0_client.fizzy_fusion.client_id}.css"
}

## Logo
resource "local_file" "beans_blend_logo" {
  content_base64  = filebase64("../public/logos/beans-blend-logo.png")
  filename = "../public/client/${auth0_client.beans_blend.client_id}.png"
}

# Fizzy Fusion
resource "local_file" "fizzy_fusion_logo" {
  content_base64  = filebase64("../public/logos/fizzy-fusion-logo.png")
  filename = "../public/client/${auth0_client.fizzy_fusion.client_id}.png"
}

## Email Templates
# verification email
data "local_file" "beans_blend_email_verification_link" {
  filename = "../email-templates/email-verification-link/beans-blend-email-verification-link.html"
}

data "local_file" "fizzy_fusion_email_verification_link" {
  filename = "../email-templates/email-verification-link/fizzy-fusion-email-verification-link.html"
}

data "local_file" "generic_email_verification_link" {
  filename = "../email-templates/email-verification-link/generic-email-verification-link.html"
}

resource "local_file" "email_verification_link_template" {
  filename = "../email-templates/.rendered/email-verification-link.liquid"
  content = templatefile("./email.tpl", {
    config = {
      (auth0_client.beans_blend.client_id) = data.local_file.beans_blend_email_verification_link.content
      (auth0_client.fizzy_fusion.client_id) = data.local_file.fizzy_fusion_email_verification_link.content
    }
    generic = data.local_file.generic_email_verification_link.content
  })
}

resource "auth0_email_template" "email_verification_link" {
  depends_on = [auth0_email_provider.mailtrap]

  body     = local_file.email_verification_link_template.content
  enabled  = true
  from     = "noreply@drinks.co"  # todo: liquid
  subject  = "email verification" # todo: liquid
  syntax   = "liquid"
  template = "verify_email"
}


# Welcome email
# verification email
data "local_file" "beans_blend_welcome" {
  filename = "../email-templates/welcome/beans-blend-welcome.html"
}

data "local_file" "fizzy_fusion_welcome" {
  filename = "../email-templates/welcome/fizzy-fusion-welcome.html"
}

data "local_file" "generic_welcome" {
  filename = "../email-templates/welcome/generic-welcome.html"
}

resource "local_file" "welcome_template" {
  filename = "../email-templates/.rendered/welcome.liquid"
  content = templatefile("./email.tpl", {
    config = {
      (auth0_client.beans_blend.client_id) = data.local_file.beans_blend_welcome.content
      (auth0_client.fizzy_fusion.client_id) = data.local_file.fizzy_fusion_welcome.content
    }
    generic = data.local_file.generic_email_verification_link.content
  })
}

resource "auth0_email_template" "welcome" {
  depends_on = [auth0_email_provider.mailtrap]

  body     = local_file.welcome_template.content
  enabled  = true
  from     = "noreply@drinks.co"  # todo: liquid
  subject  = "Welcome Email"      # todo: liquid
  syntax   = "liquid"
  template = "welcome_email"
}
