"""Offline integrity check for the two preserved source documents; executes no app code."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parent
provenance = json.loads((root / "provenance.json").read_text())
if set(provenance["files"]) != {"PRD.md", "platform.gitmodules"}:
    raise ValueError("Incomplete provenance members")
for name, expected in provenance["files"].items():
    if name not in {"PRD.md", "platform.gitmodules"}:
        raise ValueError("Unexpected provenance member")
    data = (root / "original" / name).read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    if (len(data), hashlib.sha256(data).hexdigest(), blob) != (
        expected["bytes"], expected["sha256"], expected["gitBlob"]
    ):
        raise ValueError("Original document integrity mismatch")
print("Verified 2 preserved original documents; no application execution")
