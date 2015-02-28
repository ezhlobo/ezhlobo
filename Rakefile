require "htmlcompressor"

def get_files_by_type(type)
  files = []
  Dir.glob("_site/**/*.#{type}").each do |filepath|
    files << filepath
  end
  files
end

desc "Run server"
task :server do
  system "bundle exec jekyll serve --watch"
end
task :s => :server

desc "Build project"
task :build do
  printf "Start\n"

  system "bundle exec jekyll build"

  compressor_options = {
    :compress_javascript => true,
    :javascript_compressor => :yui,
    :compress_css => true,
    :css_compressor => :yui,

    :remove_intertag_spaces => true
  }

  Compressor = HtmlCompressor::Compressor.new compressor_options

  get_files_by_type("html").each do |filepath|
    content = Compressor.compress(File.open(filepath, "r:utf-8").read)

    f = File.new(filepath, "w")
    f.puts content
    f.close

    printf "[compressed]: #{filepath}\n"
  end
end
