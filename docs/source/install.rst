Installing Evalg 3.0
====================


Installing from repository
--------------------------

*evalg* is published to an internal University of Oslo repository, at
`<https://repo.usit.uio.no/nexus/>`_.

There are two relevant repositories:

`<https://repo.usit.uio.no/nexus/repository/pypi-usit-int/>`_
   A repository with custom packages, not normally available at `PyPI`_. This
   repository is typically used as an ``--extra-index-url``, to supplement
   packages at PyPI.

`<https://repo.usit.uio.no/nexus/repository/pypi-usit/>`_
   A repository that proxies PyPI in addition to our custom packages.  This
   repository is typically used to replace PyPI as ``--index-url``.

To install *evalg* using these repositories:

::

   pip install \
       --index-url https://repo.usit.uio.no/nexus/repository/pypi-usit/simple \
       evalg
   # or
   pip install \
       --extra-index-url https://repo.usit.uio.no/nexus/repository/pypi-usit-int/simple \
       evalg

Configure index
~~~~~~~~~~~~~~~

Indexes can be configured permanently, for the system, user or virtualenv.

To configure an ``extra-index-url``, only a `pip config`_ is needed:

::

   [global]
   extra-index-url =
       https://repo.usit.uio.no/nexus/repository/pypi-usit-int/simple

To configure an ``index-url`` you'll need both a `pip config`_:

::

   [global]
   index = https://repo.usit.uio.no/nexus/repository/pypi-usit/pypi
   index-url = https://repo.usit.uio.no/nexus/repository/pypi-usit/simple

... and a `distutils config`_:

::

   [easy_install]
   index-url = https://repo.usit.uio.no/nexus/repository/pypi-usit/simple



Install from source
-------------------

Install in a `virtualenv`_ to avoid conflicts and other issues with your
operating system python environment:

::

   python3 -m venv /path/to/my_env
   source /path/to/my_env/bin/activate

Install *evalg* by running the included ``setup.py`` script:

::

   cd /path/to/evalg_source
   python setup.py install


.. _virtualenv: https://virtualenv.pypa.io/en/stable/
.. _PyPI: https://pypi.org/
.. _distutils config: https://docs.python.org/2.5/inst/config-syntax.html
.. _pip config: https://pip.pypa.io/en/stable/user_guide/#configuration

