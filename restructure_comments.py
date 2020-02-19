import frontmatter
import os
import re
import hashlib
def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()
d = "2016"
f = "mail-support-for-docker-s-php-fpm-2017-06-14.md"

d=""
f="_comments_prev/2010/07/11/microscope-puzzle-2010-07-11-21-40-38.md"

pid_regex = re.compile(r"^.*/([^/]+) *$", re.IGNORECASE)

def convert (read, write):
  hsh = md5(read)
  post = frontmatter.load(read)
  post["_id"] = hsh
  post["_parent"] = hsh
  if "link" not in post:
    post["link"] = ""
  post["message"] = post.content
  post.content = ""
  #print(post.content)

  #for i in sorted(post.keys()):
      #print (i, post[i])
  #print(post['date'])
  #print(frontmatter.dumps(post))
  
  if "post_id" in post:
    f = "".join([ c if c.isalnum() else "-" for c in post["date"]])
    write = os.path.join("_comments/", pid_regex.sub ("\\1", post["post_id"]), f + ".yml")
  
  #print (write)
  
  os.makedirs (os.path.dirname(write), exist_ok=True)
  with open (write, "w") as w:
    w.write (frontmatter.dumps(post))


#convert (os.path.join(d,f), None)

f_regex = re.compile(r"^(.*)-([0-9]{4})([0-9:-]+).md", re.IGNORECASE)

num = 0
for root, dirs, files in os.walk("_comments_prev"):
    path = root.split(os.sep)
    for filename in files:
        if ".md" not in filename:
          continue
        num = num + 1
        #print (root)
        #print (os.path.join(root, filename))
        #print (">",num, os.path.join("_comments/", f_regex.sub ("\\1/\\2\\3.md", filename)))
        convert (os.path.join(root, filename), os.path.join("_comments/", f_regex.sub ("\\1/\\2\\3.yml", filename)))
        #print (">",num, f_regex.sub ("\\1", filename))


