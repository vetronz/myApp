import csv
import json

csv_f = 'DGE_results_1_head.csv'
json_f = 'DGE_results_1_head.json'

csvfile = csv_f, 'r'
jsonfile = json_f, 'w'

fieldnames = ("","baseMean","log2FoldChange","lfcSE","stat","pvalue","padj")
reader = csv.DictReader(csvfile, fieldnames)
jsonfile.write('[')
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(',\n')

with open('jsonfile.txt', 'a') as the_file:
    the_file.write(']')


    with open("test.txt", "a") as myfile:
        myfile.write("appended text")



#!/usr/bin/python
import csv , json

csvFilePath = "DGE_results_1_head.csv"
jsonFilePath = "j_test.json"
arr = []
#read the csv and add the arr to a arrayn

with open (csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    print(csvReader)
    for csvRow in csvReader:
        arr.append(csvRow)

print(arr)

# write the data to a json file
with open(jsonFilePath, "w") as jsonFile:
    jsonFile.write(json.dumps(arr, indent = 4))
