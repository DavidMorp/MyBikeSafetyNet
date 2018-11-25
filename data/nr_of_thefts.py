from scipy import spatial # spatial
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

frame = pd.read_csv('bike_theft_data_updated.csv') # picking the data
df = frame[['Latitude', 'Longitude']] # cleaning the data
point = df.as_matrix()
tree = spatial.KDTree(point) # running KDTree algorithm

# function returning nr of thefts within 100 m
def nrOfThefts(lat,lon):
    s = tree.query_ball_point([lat, lon], 0.001)
    return len(s)