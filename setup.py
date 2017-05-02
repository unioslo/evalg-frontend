#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Setup file for eValg. """
from __future__ import print_function

import os
import sys
from setuptools import setup
from setuptools import find_packages
from setuptools.command.test import test as TestCommand


HERE = os.path.dirname(__file__)

PACKAGE_NAME = 'evalg'
PACKAGE_DESC = 'An electronic voting application'
PACKAGE_AUTHOR = 'UIO/LOS/USIT/UAV/INT'
PACKAGE_URL = 'https://bitbucket.usit.uio.no/projects/EVALG/repos/evalg/'


def get_requirements(filename):
    """ Read requirements from file. """
    with open(filename, 'r') as reqfile:
        for req_line in reqfile.readlines():
            req_line = req_line.strip()
            if req_line:
                if req_line.startswith('-'):
                    continue  # some pip option, hide line from setuptools
                yield req_line


def get_packages():
    """ List of (sub)packages to install. """
    return find_packages('.', include=(
        'evalg_common', 'evalg_common.*',
        'evalg', 'evalg.*',
        'ballotbox', 'ballotbox.*',
    ))


def build_package_data(packages, *include):
    """ Generate a list of package_data to include. """
    for package in packages:
        yield package, list(include)


class PyTest(TestCommand, object):
    """ Run tests using pytest.

    From `http://doc.pytest.org/en/latest/goodpractices.html`.

    """

    user_options = [('pytest-args=', 'a', "Arguments to pass to pytest")]

    def initialize_options(self):
        super(PyTest, self).initialize_options()
        self.pytest_args = []

    def run_tests(self):
        import shlex
        import pytest
        args = self.pytest_args
        if args:
            args = shlex.split(args)
        errno = pytest.main(args)
        raise SystemExit(errno)


def setup_package():
    """ Build and run setup. """

    setup_requires = ['setuptools_scm']

    # TODO: Is this good enough? Will it catch aliases?
    #       Are there better methods to figure out which command we are about
    #       to run?
    if {'build_sphinx', 'upload_docs'}.intersection(sys.argv):
        # sphinx modules
        setup_requires.extend(['sphinx', 'sphinxcontrib-httpdomain'])
        # dependencies for generating autodoc
        setup_requires.extend(get_requirements('requirements.txt'))

    packages = get_packages()

    setup(
        name=PACKAGE_NAME,
        description=PACKAGE_DESC,
        author=PACKAGE_AUTHOR,
        url=PACKAGE_URL,

        use_scm_version=True,

        packages=packages,
        package_data=dict(
            build_package_data(packages, '*.tpl')),

        setup_requires=setup_requires,
        install_requires=list(
            get_requirements('requirements.txt')),
        tests_require=list(
            get_requirements('requirements-test.txt')),

        cmdclass={
            'test': PyTest,
            'pytest': PyTest,
        }
    )


if __name__ == "__main__":
    from setuptools_scm import get_version
    print("evalg version: {!s}".format(get_version()))
    print("packages: {!r}".format(get_packages()))
    print("")
    setup_package()
