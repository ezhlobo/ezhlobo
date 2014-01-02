require "cssmin"
require "closure-compiler"
require "html_press"

def get_files_by_type(type)
	files = []
	Dir.glob("_site/**/*.#{type}").each do |filepath|
    files << filepath
  end
  files
end

desc "Build project"
task :build do
	printf "Start\n"

	system "jekyll build"

	get_files_by_type("css").each do |filepath|
		content = CSSMin.minify(File.open(filepath, "r"))

		# calc(a+b) => calc(a + b)
		content = content.gsub(/calc\((\d+.{1,2})\+(\d+.{1,2})\)/i, 'calc(\1 + \2)')

	  f = File.new(filepath, "w")
	  f.puts content
	  f.close

		printf "[compressed]: #{filepath}\n"
	end

	# get_files_by_type("js").each do |filepath|
	# 	content = Closure::Compiler.new.compile(File.open(filepath, "r"))
	#   f = File.new(filepath, "w")
	#   f.puts content
	#   f.close

	# 	printf "[compressed]: #{filepath}\n"
	# end

	get_files_by_type("html").each do |filepath|
		content = HtmlPress.press(File.open(filepath, "r"))

	  f = File.new(filepath, "w")
	  f.puts content
	  f.close

		printf "[compressed]: #{filepath}\n"
	end

end
