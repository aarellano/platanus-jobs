require "capistrano/node-deploy"

set :application, "platanus-jobs"
set :repository,  "git@github.com:aarellano/platanus-jobs.git"
set :user, "deploy"
set :scm, :git
ssh_options[:forward_agent] = true
default_run_options[:pty] = true
set :deploy_to, "/home/deploy/applications/platanus-jobs"

role :app, "kross.platan.us"