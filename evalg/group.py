from evalg.models.group import Group
from sqlalchemy import func


def search_group(filter_string):
    """ Look for groups that match a filter-string on one of
    the relevant attributes"""
    f = '%' + filter_string + '%'
    return Group.query.filter(func.lower(Group.name).like(f)).all()
