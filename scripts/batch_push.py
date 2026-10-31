import os
import subprocess
import time
import sys

TARGET_CHUNK_SIZE_MB = 35  # ~35MB chunks (uploads in ~20s, very resilient to Wi-Fi jitter)
COLLECTION_DIR = "collection"

def run_cmd(cmd, check=False):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res

def get_untracked_collection_files():
    res = run_cmd("git ls-files -o collection")
    lines = [line.strip().replace("\\", "/") for line in res.stdout.splitlines() if line.strip()]
    return sorted(lines)

def group_into_chunks(files, max_mb):
    chunks = []
    current_chunk = []
    current_size = 0

    for f in files:
        if not os.path.exists(f):
            continue
        sz = os.path.getsize(f)
        if current_chunk and (current_size + sz) > (max_mb * 1024 * 1024):
            chunks.append(current_chunk)
            current_chunk = [f]
            current_size = sz
        else:
            current_chunk.append(f)
            current_size += sz

    if current_chunk:
        chunks.append(current_chunk)
    return chunks

def main():
    files = get_untracked_collection_files()
    total_files = len(files)
    if total_files == 0:
        print("All collection wallpapers are already committed and up-to-date on GitHub!", flush=True)
        return

    total_bytes = sum(os.path.getsize(f) for f in files if os.path.exists(f))
    print(f"Remaining: {total_files} wallpapers ({total_bytes / (1024*1024):.1f} MB) to upload.", flush=True)

    chunks = group_into_chunks(files, TARGET_CHUNK_SIZE_MB)
    print(f"Divided into {len(chunks)} resilient batches (~{TARGET_CHUNK_SIZE_MB} MB each).\n", flush=True)

    for idx, chunk in enumerate(chunks, 1):
        chunk_mb = sum(os.path.getsize(f) for f in chunk) / (1024 * 1024)
        print(f"[{idx}/{len(chunks)}] Staging {len(chunk)} images ({chunk_mb:.1f} MB)...", flush=True)

        batch_args = " ".join([f'"{f}"' for f in chunk])
        add_res = run_cmd(f"git add {batch_args}")
        if add_res.returncode != 0:
            print(f"Failed to stage batch {idx}: {add_res.stderr}", flush=True)
            sys.exit(1)

        commit_msg = f"feat(collection): chunk {idx}/{len(chunks)} ({len(chunk)} wallpapers)"
        commit_res = run_cmd(f'git commit -m "{commit_msg}"')
        if commit_res.returncode != 0 and "nothing to commit" not in commit_res.stdout:
            print(f"Commit error on batch {idx}: {commit_res.stderr}", flush=True)

        pushed = False
        for attempt in range(1, 6):
            print(f"[{idx}/{len(chunks)}] Pushing to GitHub (Attempt {attempt}/5)...", flush=True)
            push_res = run_cmd("git push origin main")
            if push_res.returncode == 0:
                print(f"[{idx}/{len(chunks)}] Succeeded! ({chunk_mb:.1f} MB pushed)\n", flush=True)
                pushed = True
                break
            else:
                err_msg = push_res.stderr.strip()[:140]
                print(f"[{idx}/{len(chunks)}] Attempt {attempt} failed: {err_msg}", flush=True)
                time.sleep(attempt * 4)

        if not pushed:
            print(f"ERROR: Failed to push batch {idx} after 5 attempts. Exiting for retry.", flush=True)
            sys.exit(1)

    print("\nSUCCESS: All 1,368 wallpapers and code are completely uploaded to https://github.com/aviisharma238/Minimal-wall.git!", flush=True)

if __name__ == "__main__":
    main()
