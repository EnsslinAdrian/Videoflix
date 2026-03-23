import subprocess


import subprocess

def convert_480p(source):
    target = source.replace(".mp4", "_480p.mp4")
    cmd = f'ffmpeg -i "{source}" -s hd480 -c:v libx264 -crf 23 -c:a aac -strict -2 "{target}"'
    print(f"[480p] Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)

def convert_720p(source):
    target = source.replace(".mp4", "_720p.mp4")
    cmd = f'ffmpeg -i "{source}" -s hd720 -c:v libx264 -crf 23 -c:a aac -strict -2 "{target}"'
    print(f"[720p] Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)

def convert_1080p(source):
    target = source.replace(".mp4", "_1080p.mp4")
    cmd = f'ffmpeg -i "{source}" -s hd1080 -c:v libx264 -crf 23 -c:a aac -strict -2 "{target}"'
    print(f"[1080p] Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)
