install:
	rm fahm.zip; zip -r fahm . -x *.git* -x \*test/\* -x package.json -x \*node_modules/\*
