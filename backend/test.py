import nltk
# nltk.download('stopwords')
# nltk.download('punkt')

# !pip install docx2txt
# !pip install chart_studio

import warnings
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
import tempfile

from nltk.corpus import stopwords
import string

from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn import metrics

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

import docx2txt
from nltk.tokenize import WhitespaceTokenizer

import plotly.graph_objects as go
import plotly.express as px

import chart_studio.plotly as py

warnings.filterwarnings('ignore')

df = pd.read_csv('UpdatedResumeDataSet.csv', encoding='utf-8')


df[df.isna().any(axis=1) | df.isnull().any(axis=1)]

df['length'] = df['Resume'].str.len()
df['length'].describe()

plt.figure(figsize=(12.8,6))
sns.distplot(df['length']).set_title('Resume length distribution')

"""### Displaying the distinct categories of resume and the number of records belonging to each category"""

df['Category'].value_counts()

plt.figure(figsize=(5,5))
plt.xticks(rotation=90)
sns.countplot(y="Category", data=df, palette='Reds')

df['Category'].value_counts()[:3].index

"""Processing Text

"""

resumeDataSet = df.copy()
resumeDataSet['cleaned_resume'] = ''
resumeDataSet.head()

import re

def cleanResume(resumeText):
    resumeText = re.sub(r'http\S+\s*', ' ', resumeText)   # remove URLs
    resumeText = re.sub(r'RT|cc', ' ', resumeText)        # remove RT and cc
    resumeText = re.sub(r'#\S+', '', resumeText)          # remove hashtags
    resumeText = re.sub(r'@\S+', '  ', resumeText)        # remove mentions
    resumeText = re.sub(r'[%s]' % re.escape("""!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"""), ' ', resumeText)  # remove punctuations
    resumeText = re.sub(r'[^\x00-\x7f]', r' ', resumeText) # remove non-ASCII
    resumeText = re.sub(r'\s+', ' ', resumeText)          # remove extra whitespace
    return resumeText

resumeDataSet['cleaned_resume'] = resumeDataSet.Resume.apply(lambda x: cleanResume(x))

"""### Encoding labels into different values"""

var_mod = ['Category']
le = LabelEncoder()
for i in var_mod:
    resumeDataSet[i] = le.fit_transform(resumeDataSet[i])

resumeDataSet.head()

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

requiredText = resumeDataSet['cleaned_resume'].values
requiredTarget = resumeDataSet['Category'].values

word_vectorizer = TfidfVectorizer(
    sublinear_tf=True,
    stop_words='english',
    max_features=1500)
word_vectorizer.fit(requiredText)
WordFeatures = word_vectorizer.transform(requiredText)

#print ("Feature completed .....")

X_train,X_test,y_train,y_test = train_test_split(WordFeatures,requiredTarget,random_state=0, test_size=0.2)
# print(X_train.shape)

clf = KNeighborsClassifier(n_neighbors=15)
clf = clf.fit(X_train, y_train)
yp = clf.predict(X_test)
# print('Accuracy of KNeighbors Classifier on training set: {:.2f}'.format(clf.score(X_train, y_train)))
# print('Accuracy of KNeighbors Classifier on test set: {:.2f}'.format(clf.score(X_test, y_test)))

# !pip install pickle
# import pickle

# save_label_encoder = open("pickles/le.pickle","wb")
# pickle.dump(le, save_label_encoder)
# save_label_encoder.close()

# save_word_vectorizer = open("pickles/word_vectorizer.pickle","wb")
# pickle.dump(word_vectorizer, save_word_vectorizer)
# save_word_vectorizer.close()

# save_classifier = open("pickles/clf.pickle","wb")
# pickle.dump(clf, save_classifier)
# save_classifier.close()

class JobPredictor:
    def __init__(self) -> None:
        self.le = le
        self.word_vectorizer = word_vectorizer
        self.clf = clf

    def predict(self, resume):
        feature = self.word_vectorizer.transform([resume])
        predicted = self.clf.predict(feature)
        resume_position = self.le.inverse_transform(predicted)[0]
        return resume_position

    def predict_proba(self, resume):
        feature = self.word_vectorizer.transform([resume])
        predicted_prob = self.clf.predict_proba(feature)
        return predicted_prob[0]


# # print(f'JD uploaded! Position: {resume_position}')

# """Cosine Similarity"""

# text_tokenizer= WhitespaceTokenizer()
# #remove_characters= str.maketrans("", "", "±§!@#$%^&*()-_=+[]}{;'\:,./<>?|")
# remove_characters = str.maketrans("", "", r"±§!@#$%^&*()-_=+[]}{;':,./<>?|")

# cv = CountVectorizer()
# def process_resume(file_bytes):
#     """Take uploaded resume file (BytesIO), return similarity score + position"""
#     import io
#     # Save file temporarily (docx2txt requires a path)
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
#         tmp.write(file_bytes.read())
#         tmp_path = tmp.name

#     try:
#         resume_docx = docx2txt.process(tmp_path)
        
#         # prediction
#         predicted_position = JobPredictor().predict(resume_docx)

#         # similarity
#         text_docx = [resume_docx, job_description]
#         words_docx_list = text_tokenizer.tokenize(resume_docx)
#         words_docx_list = [s.translate(remove_characters) for s in words_docx_list]

#         count_docx = cv.fit_transform(text_docx)
#         similarity_score_docx = cosine_similarity(count_docx)
#         match_percentage_docx = round(similarity_score_docx[0][1] * 100, 2)

#         return {
#             "predicted_position": predicted_position,
#             "match_percentage": match_percentage_docx
#         }
#     finally:
#         os.remove(tmp_path)  # cleanup


def calculate_match(resume_text: str, jd_text: str):
    """
    Takes resume text and job description text,
    returns predicted job role + match percentage
    """
    # --- Predict category ---
    job_predictor = JobPredictor()
    resume_position = job_predictor.predict(jd_text)

    # --- Cosine similarity ---
    text_tokenizer = WhitespaceTokenizer()
    remove_characters = str.maketrans("", "", r"±§!@#$%^&*()-_=+[]}{;':,./<>?|")

    cv = CountVectorizer()
    text_docx = [resume_text, jd_text]

    # tokenizing + cleaning
    words_docx_list = text_tokenizer.tokenize(resume_text)
    words_docx_list = [s.translate(remove_characters) for s in words_docx_list]

    # vectorize
    count_docx = cv.fit_transform(text_docx)

    # similarity
    similarity_score_docx = cosine_similarity(count_docx)
    match_percentage_docx = round((similarity_score_docx[0][1] * 100), 2)

    return {
        "predicted_role": resume_position,
        "match_percentage": match_percentage_docx
    }
