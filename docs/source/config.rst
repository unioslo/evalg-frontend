Configuring Evalg
=================

Instance folder
---------------

.. note::

   This is only relevant when installing from the package.
   When running the development enviroment, the instance folder
   in the repo is used.

We store all configuration files in the flask instance folder.
We use the environment variables *EVALG_CONFIG* to set the path.
 
::

 export EVALG_CONFIG="/path/to/evalg/instance"

evalg_config.py
---------------

Main config file. Overrides default values in `evalg/default_config.py`.

.. todo::
   
   Document the config parameters.

evalg_template_config.py
------------------------

Defines the rulesets used by the various supported election.

.. todo::
   
   Document the election rulsets.


