#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" eValg logging. """

import logging
import logging.config

DEBUG_LOGGING_CONFIG = {
    'disable_existing_loggers': False,
    'version': 1,
    'loggers': {
        '': {
            'handlers': ['stream_stderr'],
            'level': 'DEBUG',
        },
        'evalg': {
            'handlers': ['stream_stderr'],
            'level': 'DEBUG',
        },
    },
    'formatters': {
        'default': {
            'datefmt': '%Y-%m-%d %H:%M:%S',
            'class': 'logging.Formatter',
            'format': '%(asctime)s - %(request_id).8s - %(levelname)s - %(name)s - %(message)s'
        },
    },
    'handlers': {
        'stream_stderr': {
            'formatter': 'default',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stderr',
            'filters': ['request_id', ],
        },
    },
    'filters': {
        'request_id': {
            '()': 'evalg.utils.request_id.RequestIdFilter'
        }
    }
}


def init_logging(app):
    """ Init logging.

    Loads log config from the first available source:

    1. ``app.config['LOGGING']`` if set
    2. ``DEBUG_LOGGING_CONFIG`` if ``app.debug``

    """
    app.logger  # this makes flask create its logger
    logging_config = app.config.get('LOGGING')

    if logging_config:
        logging.config.dictConfig(logging_config)
    elif app.debug:
        logging.config.dictConfig(DEBUG_LOGGING_CONFIG)

    # Set default logger level based on app debug setting
    if app.logger.level == logging.NOTSET:
        level = logging.DEBUG if app.debug else logging.INFO
        print(
            "Logging: Setting level to {!s}".format(
                logging.getLevelName(level)))
        app.logger.setLevel(level)
    else:
        print(
            "Logging: Level {!s}".format(
                logging.getLevelName(app.logger.getEffectiveLevel())))
