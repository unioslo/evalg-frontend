# evalg documentation


## Requiements

See 'requirements.txt' for requirements on building the documentation.

```
pip install -r requirements.txt
```


## How to build

```
make html
```


### Build PDFs on Fedora

```
dnf install \
    texlive-collection-fontsrecommended \
    texlive-collection-latexrecommended \
    texlive-collection-latexextra \
    latexmk
make latexpdf
```
