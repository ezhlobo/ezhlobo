require "htmlcompressor"

class Compressor
  def html(*args)
    common('html', *args)
  end

  def css(*args)
    common('css', *args)
  end

  def html_plain(content)
    HtmlCompressor::Compressor.new(html_options).compress(content)
  end

  def css_plain(content)
    YUI::CssCompressor.new.compress(content)
  end

  private

    def common(type, input, output = input)
      content = self.send("#{type}_plain", File.open(input, "r:utf-8").read)

      f = File.new(output, "w")
      f.puts content
      f.close

      if output != input
        File.delete(input)
      end

      print_after(output)
    end

    def print_after(path)
      printf "[compressed]: #{path}\n"
    end

    def html_options
      {
        :compress_javascript => true,
        :javascript_compressor => :yui,
        :compress_css => true,
        :css_compressor => :yui,

        :remove_intertag_spaces => true
      }
    end
end
