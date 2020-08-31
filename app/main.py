from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import os
from flask import Flask, jsonify, request
import time

chrome_options = webdriver.ChromeOptions()
chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")

browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"),chrome_options=chrome_options)
app = Flask(__name__)


def getInfo(question):
    global browser
    browser.get('http://www.wikipedia.com')
    elem = browser.find_element_by_xpath('//*[@id="searchInput"]')
    elem.send_keys(question + Keys.RETURN)
    body = browser.find_element_by_xpath('/html/body')
    bodyInnerHTML = body.get_attribute('innerHTML')
    soup = BeautifulSoup(bodyInnerHTML, 'html.parser')
    head = soup.find_all('p')[0:5]
    leng = int(len(question)/3)
    text = ''
    for i in head:
        truth = question[:leng] in i.get_text()
        if truth:
            text = text + i.get_text()
        else:
            continue
    return text


@app.route('/')
def home():
    return 'This is Home Page!'


@app.route('/info', methods=['GET', 'POST'])
def info():
    global browser
    testQn = request.form.get('question')
    answer = getInfo(testQn)
    return jsonify({
        'Status': 'Information Recieved',
        'Status Code': 200,
        'Answer': answer
    })

@app.route('/test', methods=['GET', 'POST'])
def test():
    global browser
    testQn = 'India'
    answer = getInfo(testQn)
    return jsonify({
        'Status': 'Information Recieved',
        'Status Code': 200,
        'Answer': answer
    })
