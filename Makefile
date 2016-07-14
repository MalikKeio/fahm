install:
	rm fahm.zip; zip -r fahm . -x *.git* -x \*tools/\* -x Makefile -x \*test/\*
