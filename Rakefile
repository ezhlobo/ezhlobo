require "./compressor"
require "digest"

def get_files_by_type(type)
  Dir.glob("_site/**/*.#{type}")
end

def update_asset(filepath)
  file = File.open(filepath, "r:utf-8")
  digest = Digest::MD5.file(file).hexdigest

  url = filepath.sub(/^_site/, "")
  url_array = url.split(".")
  url_digest = "#{url_array[0]}-#{digest}.#{url_array[1]}"
  path_digest = "_site#{url_digest}"

  Compressor.new.css(filepath, path_digest)

  get_files_by_type("html").each do |out_path|
    content_digest = File.open(out_path, "r:utf-8").read.gsub(url, url_digest)

    f = File.new(out_path, "w")
    f.puts content_digest
    f.close
  end
end

def update_images(filepath)
  file = File.open(filepath, "r:utf-8")
  digest = Digest::MD5.file(file).hexdigest

  url_array = filepath.split(".")
  url_digest = "#{url_array[0]}-#{digest}.#{url_array[1]}"

  File.rename(filepath, url_digest)
  printf "[add_digest]: #{url_digest}\n"

  get_files_by_type("html").each do |out_path|
    content_digest = File.open(out_path, "r:utf-8").read.gsub(filepath.gsub(/^_site/, ''), url_digest.gsub(/^_site/, ''))

    f = File.new(out_path, "w")
    f.puts content_digest
    f.close
  end
end

desc "Run server"
task :server do
  system "bundle exec jekyll serve --watch"
end
task :s => :server

desc "Build project"
task :build do
  system "bundle exec jekyll build"

  get_files_by_type("html").each do |filepath|
    Compressor.new.html(filepath)
  end

  get_files_by_type("css").each do |filepath|
    update_asset(filepath)
  end

  get_files_by_type("jpg").each do |filepath|
    update_images(filepath)
  end
end
