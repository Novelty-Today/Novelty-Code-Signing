run `pip install .` in python-package (aka this folder) to globally install/reinstall this library,  
if you want to remove this library run `pip uninstall novelty_code_sign`  
if you want to use this library on a single project only, you will need to setup virtual env (https://docs.python.org/3/library/venv.html) and run pip inside of it.  
to import this library inside of your project  
`from novelty_code_sign import sign`  
`from novelty_code_sing import verify`  
you most likely want to use easy_sign and easy_verify function, every other function in this package are very low level.
