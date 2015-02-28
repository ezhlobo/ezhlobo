require "htmlcompressor"
require "digest"

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
  CssCompressor = YUI::CssCompressor.new

  def css_compress(content)
    CssCompressor.compress(content)
  end

  def print_after_compress(path)
    printf "[compressed]: #{path}\n"
  end

  get_files_by_type("html").each do |filepath|
    content = Compressor.compress(File.open(filepath, "r:utf-8").read)

    f = File.new(filepath, "w")
    f.puts content
    f.close

    printf "[compressed]: #{filepath}\n"
  end

  def update_asset(filepath)
    content = File.open(filepath, "r:utf-8")
    digest = Digest::MD5.file(content).hexdigest

    url = filepath.sub(/^_site/, '')
    url_array = url.split('.')
    url_digest = "#{url_array[0]}-#{digest}.#{url_array[1]}"
    path_digest = "_site#{url_digest}"

    f = File.new(path_digest, "w")
    f.puts css_compress(content.read)
    f.close
    File.delete(filepath)
    print_after_compress(path_digest)

    def add_digest(content, url, url_digest)
      content.gsub(url, url_digest)
    end

    get_files_by_type("html").each do |out_path|
      content = File.open(out_path, "r:utf-8").read
      content_digest = add_digest(content, url, url_digest)

      f = File.new(out_path, "w")
      f.puts content_digest
      f.close
    end
  end

  get_files_by_type("css").each { |filepath| update_asset(filepath) }
end
