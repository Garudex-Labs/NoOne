"""Legacy import boundary; implementation lives in agent_cli.profiles.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.profiles import (
    _PROFILE_ID_RE,
    _get_default_agent_home as _get_default_hermes_home,
    _get_profiles_root,
    _stop_gateway_process,
    backfill_profile_envs,
    get_active_profile_name,
    list_profiles,
    normalize_profile_name,
    profiles_to_serve,
    seed_profile_skills,
    validate_profile_name,
)

_current = import_module('agent_cli.profiles')
sys.modules[__name__] = _current

_current._get_default_hermes_home = _get_default_hermes_home
