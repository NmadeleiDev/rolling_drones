import pandas as pd
import numpy as np
import re
import logging


def read_file_to_dataframe(filename: str, data) -> any:
    ext = filename.split('.')[-1].lower()
    if ext == 'csv':
        df = pd.read_csv(data)
    if ext == 'tsv':
        df = pd.read_csv(data, delimiter='\t')
    elif ext == 'xlsx' or ext == 'xls':
        df = pd.read_excel(data, sheet_name=None)
    else:
        return None

    return df

def select_cols_for_facts_df(df: pd.DataFrame) -> pd.DataFrame:
    facts_regex = re.compile('(Наименование\s+?показателя|Консолидированный бюджет)', re.IGNORECASE)
    
    facts_line = None
    for row in df.fillna('').astype(str).values:
        matches = [facts_regex.search(x) is not None for x in row]
        n_matched = len([x for x in matches if x is True])
        if n_matched > 0 and facts_line is None:
            facts_line = matches.copy()
        elif n_matched > 0 and facts_line is not None:
            facts_line = np.logical_or(facts_line, matches).reshape((-1, ))
            break
        
    if facts_line is None:
        return df.T.iloc[[0, len(df.columns) - 1]].T
    facts_line[0] = True
    return df.T.iloc[np.argwhere(facts_line).reshape((-1,))].T

def select_cols_for_forecasts_df(df: pd.DataFrame) -> pd.DataFrame:
    facts_regex = re.compile('(\d{4}\s+?год\s+?)?(факт|оценка)', re.IGNORECASE)
    var_name_regex = re.compile('базовый', re.IGNORECASE)
    var_idx_regex = re.compile('вариант\s1', re.IGNORECASE)
    
    facts_line = None
    vars_line = None
    for row in df.fillna('').astype(str).values:
        matches = [facts_regex.search(x) is not None for x in row]
        if len([x for x in matches if x is True]) == 3:
            facts_line = matches.copy()
            
        matches = [var_name_regex.search(x) is not None for x in row]
        if len([x for x in matches if x is True]) == 3:
            vars_line = matches.copy()
            
        matches = [var_idx_regex.search(x) is not None for x in row]
        if vars_line is None and len([x for x in matches if x is True]) == 3:
            vars_line = matches.copy()
            
        if facts_line is not None and vars_line is not None:
            break

    
    if facts_line is None or vars_line is None:
        return None
            
    take_idxs = np.logical_or(facts_line, vars_line)
    take_idxs[0] = True
    return df.T.iloc[np.argwhere(take_idxs).reshape((-1,))].T