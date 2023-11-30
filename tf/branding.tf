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
  content_base64  = filebase64("../logos/beans-blend-logo.png")
  filename = "../public/logo/${auth0_client.beans_blend.client_id}.png"
}

# Fizzy Fusion
resource "local_file" "fizzy_fusion_logo" {
  content_base64  = filebase64("../logos/fizzy-fusion-logo.png")
  filename = "../public/logo/${auth0_client.fizzy_fusion.client_id}.png"
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

