# eValg – Internet voting for the University of Oslo

## Introduction

In 2006, the University of Oslo decided that its elections should be
electronic. For such, an web application was developed. Now (2017),
this web application is old, and it builds upon an unmaintained,
framework. Therefore it was decided to modernize the electronic voting
application.

## Principles

The new version builds upon the same principles as the old version:

* One should be permitted to vote several times, overwriting previous
  votes
* Votes should be encrypted and stored in a different location from
  the rest of the data
* A person should only be allowed to submit one single counting vote.
  If the same person logs in with different user ID's, they should
  be linked to the same voter (using whatever ID possible).

## Versioning

The first stable release of this software will become eValg 3.0, as 2.x
was the older software. Versioning is done by tagging git commits and is
automatically picked up by `setuptools_scm`.

See https://github.com/pypa/setuptools_scm

The tag should start with the letter v (for version), and then follow the
syntax of PEP 440, normally `vX.Y.Z`, where here X, Y and Z are numbers,
Y and Z being optional. Optionally, we can use the «aN», «bN» or «rcN» and the
other possibilities in PEP 440. The version should follow semantic versioning
guidelines.

## Install
To run the installer, you'll need a new version of setuptools::

```
pip install -U setuptools
```

To install the module using the setup script, you'll need to run::

```
pip install .
# OR
python setup.py install
```

## Run

To run one of the applications using `gunicorn`:

```
gunicorn evalg:wsgi
# OR
gunicorn ballotbox:wsgi
```

To run one of the applications using the builtin Flask server:

```
export FLASK_APP=evalg  # or ballotbox
flask run
# see: flask run --help
```

## Configuration

`evalg` and `ballotbox` first loads the `default_config.py` file found in the
package directory. Override settings defined here by:

1. Creating `evalg_config.py` or `ballotbox_config.py` in the
   `app.instance_path`
2. Putting a config file path in the environment variables `EVALG_CONFIG` or
   `BALLOTBOX_CONFIG`


## Shell

The flask shell command also comes with a shell utility:

```
FLASK_APP=evalg flask shell
```

See http://flask.pocoo.org/docs/latest/shell/

## Other CLI commands

This lists all CLI commands an application has to offer:

```
FLASK_APP=evalg flask --help
```
