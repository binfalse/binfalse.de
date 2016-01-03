---
layout: post
title: 'JavaDoc Cheat Sheet'
categories:
  - software
  - java
  - programming
tags:
  - java
  - programming
  - snippet
---

* The first sentence of each doc comment should be a summary sentence
* Write the description to be implementation-independent, but specifying such dependencies where necessary. (what is required, what is allowed)
* wrap keywords in `<code>...</code>`


## typical meta annotations
* `@author` is not critical, because it is not included when generating the API specification
* `@version` SCCS string `"%I%, %G%"`, which converts to something like " 1.39, 02/28/97" (mm/dd/yy) when the file is checked out of SCCS
* `@since` specify the product version when the Java name was added to the API specification (if different from the implementation)

## typical method definition
* `@param parameter-name description`
  * followed by the name (not data type) of the parameter, followed by a description of the parameter
  * the first noun in the description is the data type
* `@return description`
  * omit for methods that return void and for constructors
  * include it for all other methods, even if its content is entirely redundant with the method description
* `@throws class-name  description` should be included for any checked exceptions (previously, it was `@exception`)

## additional annotations
* `{@value  package.class#field}`
  * when `{@value}` is used (without any argument) in the doc comment of a static field, it displays the value of that constant: `The value of this constant is {@value}.`
  * otherwise it displays the value of the specified constant: `Evaluates the script starting with {@value #SCRIPT_START}.`
* `{@code  text}`
  * Equivalent to `<code>{@literal}</code>`.

## linking
* `@see reference`
  * Adds a `"See Also"` heading
  * `reference` is a `string`: Adds a text entry for string. No link is generated. The string is a book or other reference to information not available by URL.
  * `reference` is an `<a href="URL#value">label</a>`: Adds a link as defined by URL#value. The `URL#value` is a relative or absolute URL.
  * `reference` is an `package.class#member  label`: Adds a link (with optional visible text label) that points to the documentation for the specified name in the Java Language that is referenced. 
* `{@link package.class#member  label}`
  * in-line link with visible text label that points to the documentation for the specified package, class or member name of a referenced class
  * not necessary to add links for all API names in a doc comment

* `@serial` (or `@serialField` or `@serialData`) for interoperability with alternative implementations of a Serializable class and to document class evolution

## deprecation
* `@deprecated deprecated-text`
  * the first sentence should at least tell the user when the API was deprecated and what to use as a replacement
  * a `{@link}` tag should be included that points to the replacement method

## example

{% highlight bash %}
/**
 * The Class CombineArchive to create/read/manipulate/store etc.
 * CombineArchives.
 * <p>
 * We directly operate on the ZIP file, which will be kept open. Therefore, do
 * not forget to finally close the CombineArchive when you're finished.
 * </p>
 * 
 * @see <a href="https://sems.uni-rostock.de/projects/combinearchive/">
 *      sems.uni-rostock.de/projects/combinearchive</a>
 * @author martin scharm
 */
public class CombineArchive
    extends MetaDataHolder
    implements Closeable
{
    /* ... */

    /**
     * Gets the the first main entry of this archive, if defined. As of RC2 of the spec there may be more than one main entry, so you should use {@link #getMainEntries()} instead.
     * 
     * @return the first main entry, or <code>null</code> if there is no main entry
     * @deprecated as of version 0.8.2, replaced by {@link #getMainEntries()}
     */
    public ArchiveEntry getMainEntry ()
    {
        if (mainEntries == null)
            return null;
        return mainEntries.size () > 0 ? mainEntries.get (0) : null;
    }
    
    /**
     * Gets the main entries as defined in the archive.
     *
     * @return the main entries in this archive
     */
    public List<ArchiveEntry> getMainEntries ()
    {
        return mainEntries;
    }

    /**
     * Replace the file associated with a certain entry while keeping the meta
     * data.
     * 
     * @param toInsert
     *          the new file to insert
     * @param oldEntry
     *          the old entry whose file should be replaced
     * @return the new entry
     * @throws IOException If an input or output exception occurred
     */
    public ArchiveEntry replaceFile (File toInsert, ArchiveEntry oldEntry) throws IOException
    {
        addEntry (toInsert, oldEntry.getFilePath (), oldEntry.getFormat (), false);
        entries.put (oldEntry.getFilePath (), oldEntry);
        return oldEntry;
    }
}
{% endhighlight %}


# References
* [oracle.com/technetwork/java/javase/documentation](http://www.oracle.com/technetwork/java/javase/documentation/index-137868.html)
* [docs.oracle.com/javase/7/docs/technotes/tools/solaris/javadoc](http://docs.oracle.com/javase/7/docs/technotes/tools/solaris/javadoc.html)
