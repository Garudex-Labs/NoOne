"""Launch metadata reads cannot create or migrate canonical storage."""

import os
from pathlib import Path
import subprocess
import sys

import pytest
