## authorisation server
resource "vercel_project" "drinks_co" {
  name      = "drinks-co"
}

data "vercel_project_directory" "static_files" {
  depends_on = [local_file.beans_blend_css, local_file.fizzy_fusion_css]
  path = "../ul/dist"
}

resource "vercel_deployment" "drinks_co_deployment" {
  project_id  = vercel_project.drinks_co.id
  files       = data.vercel_project_directory.static_files.files
  path_prefix = data.vercel_project_directory.static_files.path
  production  = true
}

## brand A app
resource "vercel_project" "beans_blend" {
  name      = "beans-blend"
}

data "vercel_project_directory" "beans_blend" {
  path = "../apps/beans-blend/build"
}

resource "vercel_deployment" "beans_blend_deployment" {
  project_id  = vercel_project.beans_blend.id
  files       = data.vercel_project_directory.beans_blend.files
  path_prefix = data.vercel_project_directory.beans_blend.path
  production  = true
}


## brand B app
resource "vercel_project" "fizzy_fusion" {
  name      = "fizzy-fusion"
}

data "vercel_project_directory" "fizzy_fusion_build" {
  path = "../apps/fizzy-fusion/dist"
}

resource "vercel_deployment" "fizzy_fusion_deployment" {
  project_id  = vercel_project.fizzy_fusion.id
  files       = data.vercel_project_directory.fizzy_fusion_build.files
  path_prefix = data.vercel_project_directory.fizzy_fusion_build.path
  production  = true
}

