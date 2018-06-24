# Go

### New Developer Setup – Mac

**Step 1:** Download [Python 3](https://www.python.org/)

**Step 2:** Create a virtual environment.

```
$ mkdir ~/.virtualenvs
$ python3 -m venv ~/.virtualenvs/go
```

**Step 3:** Clone this [GitHub repository](https://github.com/Bargotta/Go)

**Step 4:**  cd into `Go`

Activate your virtual environment by running `$ source ~/.virtualenvs/go/bin/activate`.

Make sure that you are now running python3 and pip3:

```
$ python -v
$ pip --version
```

(The pip version should say something about using Python 3)

**Step 5:** Install the requirements for Go:

`$ pip install –r requirements.txt`

**Step 6:** Run the project:

`$ python manage.py runserver`