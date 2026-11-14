"""Legacy import boundary; implementation lives in agent_cli.update_contract.

Retained for shipped updater/plugin compatibility, sharing the canonical module.
"""
from importlib import import_module
import sys

from agent_cli.update_contract import (
    COMMIT_BUILD_UPDATE_MESSAGE,
    evaluate_update_admission,
    is_commit_build,
    record_refusal_receipt,
)

_current = import_module('agent_cli.update_contract')
sys.modules[__name__] = _current
