# Go

### New Developer Setup – Mac

**Step 1:** Download [Python 3](https://www.python.org/)

**Step 2:** Create a virtual environment using these steps (you can replace the name `go` if you wish, but make sure to change it when running the environment as well):
`$ mkdir ~/.virtualenvs`
`$ python3 -m venv ~/.virtualenvs/go`

**Step 3:** Clone this [GitHub repository](https://github.com/Bargotta/Go)

**Step 4:**  cd into `Go`
Activate your virtual environment by running
`$ source ~/.virtualenvs/go/bin/activate`
Make sure that you are now running python3 and pip3 by typing
`$ python -v`
`$ pip --version`
(The pip version should say something about using Python 3)

**Step 5:** install the requirements for Go by running
`$ pip install –r requirements.txt`

**Step 6:** run the project by typing
`$ python manage.py runserver`