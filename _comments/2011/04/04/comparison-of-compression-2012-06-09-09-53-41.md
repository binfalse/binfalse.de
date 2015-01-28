---
name: 'Tagir Valeev'
link: ''
date: '2012-06-09 09:53:41'
comment: 'Comparison is unfair and biased towards gzip/bzip2, because you first used tar (practically to join all files into single big file). Other archivers compress each file independently, so they cannot gain an advantage of similarities between files (but they allow you to unpack any file or remove/replace files without repacking the whole archive). If you use tar as the first step for all other archivers as well, results will be much more fair. Rar has a special option -s (solid archive) which allows you to use inter-file compression. From your tests it seems that similarities between files can affect the result pretty much (especially for /var/log content and source code).'
post_id: /2011/04/04/comparison-of-compression

---


