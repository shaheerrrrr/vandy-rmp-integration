# Privacy Policy — Vandy RMP Integration

**Effective date:** June 15, 2026

Vandy RMP Integration ("the extension") is a browser extension that displays
Rate My Professors ratings next to instructor names on Vanderbilt University's
YES (Your Enrollment Services) class-search pages. This policy explains exactly
what the extension does and does not do with information.

The short version: the extension does not collect, store, or transmit any
personal information, it has no accounts, no analytics, and no tracking, and it
sends no data to any server operated by the developer.

## Information the extension accesses

When you view a class-search page on Vanderbilt YES, the extension reads the
**instructor names** shown on that page. These names come from Vanderbilt's
public course listings. The extension uses each name only to look up that
professor's public ratings.

The extension does **not** read, collect, or store:

- Your name, email, student ID, login credentials, or any account information
- Your browsing history or activity on any other website
- Page content other than the instructor names needed to perform a lookup
- Any analytics, usage metrics, or device identifiers

## How the information is used

Instructor names are used for one purpose: to query Rate My Professors for that
professor's public rating, difficulty score, "would take again" percentage, and
profile link, which the extension then displays on the page.

## Information shared with third parties

To retrieve ratings, the extension sends the instructor's name to
**Rate My Professors** (ratemyprofessors.com), a third-party service. This is
the only outbound network request the extension makes. Rate My Professors'
handling of that request is governed by its own privacy policy, available at
https://www.ratemyprofessors.com/.

The extension does not share information with any other third party. The
developer does not operate any server that receives your data, and **no data is
ever sold or transferred for advertising or any other purpose.**

## Data storage and retention

To avoid repeated lookups, the extension caches the ratings it retrieves in your
browser's local storage (`chrome.storage.local`). This cache:

- Stays entirely on your own device and is never transmitted anywhere
- Contains only publicly available professor ratings, not personal information
- Expires automatically after 7 days

## Your choices

You can clear all cached data at any time by removing the extension's storage in
your browser's settings, or simply by uninstalling the extension. Uninstalling
the extension removes all locally stored data.

## Permissions

The extension requests only the permissions it needs to function:

- **Storage** — to cache professor ratings locally so they don't have to be
  fetched repeatedly.
- **Access to ratemyprofessors.com** — to fetch professor ratings.
- **Access to more.app.vanderbilt.edu** — to read instructor names on YES pages
  and display ratings beside them.

## Children's privacy

The extension is intended for university students and the general public. It
does not knowingly collect personal information from anyone, including children.

## Changes to this policy

If this policy changes, the updated version will be posted at this same location
with a revised effective date.

## Contact

Questions about this policy can be sent to **khanshaheer20008@gmail.com**, or filed as
an issue on the project's GitHub repository.

## Disclaimer

Vandy RMP Integration is an independent, unofficial tool. It is not affiliated
with, endorsed by, or sponsored by Vanderbilt University or Rate My Professors.
"Rate My Professors" and "Vanderbilt" are the property of their respective
owners.
