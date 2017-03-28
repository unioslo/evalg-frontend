#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import argparse
from evalg import __VERSION__ as VERSION
from evalg import wsgi


def readable_file_type(path):
    """ Validate and normalize path. """
    abspath = os.path.abspath(os.path.expanduser(path))
    if not os.path.exists(abspath):
        raise argparse.ArgumentTypeError("No file {!s}".format(path))
    if not os.path.isfile(abspath):
        raise argparse.ArgumentTypeError("{!s} is not a file".format(path))
    if not os.access(abspath, os.R_OK):
        raise argparse.ArgumentTypeError("Unable to read {!s}".format(path))
    return abspath


def show_config(app, args):
    """ Print config. """
    print("Settings:")
    for setting in sorted(app.config):
        print("  {!s}: {!r}".format(setting, app.config[setting]))


def show_routes(app, args):
    """ Print routing rules. """
    print("Routes:")
    for rule in app.url_map.iter_rules():
        print("  {!r}".format(rule))


def run_app(app, args):
    """ Run Flask server. """
    app.run(host=args.host, port=args.port)


def main(args=None):
    parser = argparse.ArgumentParser(description=__doc__)

    # common args

    parser.add_argument(
        '-v', '--version',
        action='version',
        version='%(prog)s version {:s}'.format(VERSION),
        help="show version number and exit")
    parser.add_argument(
        '-c', '--config',
        metavar='FILE',
        default=None,
        type=readable_file_type,
        help="use config from %(metavar)s")

    commands = parser.add_subparsers(help='Valid commands')

    # run
    run_parser = commands.add_parser("run")
    run_parser.add_argument(
        '--host',
        metavar='HOST',
        type=str,
        default='127.0.0.1',
        help="bind server to host %(metavar)s (default: %(default)s)")
    run_parser.add_argument(
        '--port',
        metavar='PORT',
        type=int,
        default=5000,
        help="bind server to port %(metavar)s (default: %(default)d)")
    run_parser.set_defaults(command=run_app)

    # show-config
    show_conf_parser = commands.add_parser("show-config")
    show_conf_parser.set_defaults(command=show_config)

    # show-routes
    route_parser = commands.add_parser("show-routes")
    route_parser.set_defaults(command=show_routes)

    args = parser.parse_args(args)

    args.command(wsgi.create(config=args.config), args)
    raise SystemExit()


if __name__ == '__main__':
    main()
