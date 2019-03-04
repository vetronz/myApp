#!/usr/bin/env cwl-runner

class: Workflow
cwlVersion: v1.0
inputs:
  DESeq2_script: File
  annotation: File
  fastq1: File[]
  fastq2: File[]
  fastq3: File[]
  fastq4: File[]
  metadata: File
  prepDE_script: File
  star_genomedir: Directory
  subject_name1: string
  subject_name2: string
  subject_name3: string
  subject_name4: string
  threads: int
outputs:
  prepde_out:
    outputSource: prepde_folder/out
    type: Directory
  star_out:
    outputSource: star_folder/out
    type: Directory
  star_samtools_out:
    outputSource: star_samtools_folder/out
    type: Directory
  star_samtools_stringtie_out:
    outputSource: star_samtools_stringtie_folder/out
    type: Directory
  star_samtools_stringtie_prepde_deseq2_out:
    outputSource: star_samtools_stringtie_prepde_deseq2_folder/out
    type: Directory
requirements:
  InlineJavascriptRequirement: {}
  MultipleInputFeatureRequirement: {}
  ScatterFeatureRequirement: {}
  StepInputExpressionRequirement: {}
steps:
  prepde_folder:
    in:
      item:
      - star_samtools_stringtie_prepde/gene_output
      - star_samtools_stringtie_prepde/transcript_output
      name:
        valueFrom: star_samtools_stringtie_prepde
    out:
    - out
    run: /data/tony/RNASeq/cwl-tools/folder.cwl
  star_1:
    in:
      genomeDir: star_genomedir
      outFileNamePrefix: subject_name1
      readFilesIn: fastq1
      threads: threads
    out:
    - sam_output
    - star_read_out
    run: /data/tony/RNASeq/cwl-tools/docker/STAR_readmap.cwl
  star_2:
    in:
      genomeDir: star_genomedir
      outFileNamePrefix: subject_name2
      readFilesIn: fastq2
      threads: threads
    out:
    - sam_output
    - star_read_out
    run: /data/tony/RNASeq/cwl-tools/docker/STAR_readmap.cwl
  star_3:
    in:
      genomeDir: star_genomedir
      outFileNamePrefix: subject_name3
      readFilesIn: fastq3
      threads: threads
    out:
    - sam_output
    - star_read_out
    run: /data/tony/RNASeq/cwl-tools/docker/STAR_readmap.cwl
  star_4:
    in:
      genomeDir: star_genomedir
      outFileNamePrefix: subject_name4
      readFilesIn: fastq4
      threads: threads
    out:
    - sam_output
    - star_read_out
    run: /data/tony/RNASeq/cwl-tools/docker/STAR_readmap.cwl
  star_folder:
    in:
      item:
      - star_1/star_read_out
      - star_2/star_read_out
      - star_3/star_read_out
      - star_4/star_read_out
      name:
        valueFrom: star
    out:
    - out
    run: /data/tony/RNASeq/cwl-tools/folder.cwl
  star_samtools_1:
    in:
      outfilename:
        source:
        - subject_name1
        valueFrom: $(self + '.bam')
      samfile: star_1/sam_output
      threads: threads
    out:
    - samtools_out
    run: /data/tony/RNASeq/cwl-tools/docker/samtools.cwl
  star_samtools_2:
    in:
      outfilename:
        source:
        - subject_name2
        valueFrom: $(self + '.bam')
      samfile: star_2/sam_output
      threads: threads
    out:
    - samtools_out
    run: /data/tony/RNASeq/cwl-tools/docker/samtools.cwl
  star_samtools_3:
    in:
      outfilename:
        source:
        - subject_name3
        valueFrom: $(self + '.bam')
      samfile: star_3/sam_output
      threads: threads
    out:
    - samtools_out
    run: /data/tony/RNASeq/cwl-tools/docker/samtools.cwl
  star_samtools_4:
    in:
      outfilename:
        source:
        - subject_name4
        valueFrom: $(self + '.bam')
      samfile: star_4/sam_output
      threads: threads
    out:
    - samtools_out
    run: /data/tony/RNASeq/cwl-tools/docker/samtools.cwl
  star_samtools_folder:
    in:
      item:
      - star_samtools_1/samtools_out
      - star_samtools_2/samtools_out
      - star_samtools_3/samtools_out
      - star_samtools_4/samtools_out
      name:
        valueFrom: star_samtools
    out:
    - out
    run: /data/tony/RNASeq/cwl-tools/folder.cwl
  star_samtools_stringtie_1:
    in:
      bam: star_samtools_1/samtools_out
      gtf: annotation
      output:
        source:
        - subject_name1
        valueFrom: $(self + ".gtf")
      threads: threads
    out:
    - stringtie_out
    run: /data/tony/RNASeq/cwl-tools/docker/stringtie.cwl
  star_samtools_stringtie_2:
    in:
      bam: star_samtools_2/samtools_out
      gtf: annotation
      output:
        source:
        - subject_name2
        valueFrom: $(self + ".gtf")
      threads: threads
    out:
    - stringtie_out
    run: /data/tony/RNASeq/cwl-tools/docker/stringtie.cwl
  star_samtools_stringtie_3:
    in:
      bam: star_samtools_3/samtools_out
      gtf: annotation
      output:
        source:
        - subject_name3
        valueFrom: $(self + ".gtf")
      threads: threads
    out:
    - stringtie_out
    run: /data/tony/RNASeq/cwl-tools/docker/stringtie.cwl
  star_samtools_stringtie_4:
    in:
      bam: star_samtools_4/samtools_out
      gtf: annotation
      output:
        source:
        - subject_name4
        valueFrom: $(self + ".gtf")
      threads: threads
    out:
    - stringtie_out
    run: /data/tony/RNASeq/cwl-tools/docker/stringtie.cwl
  star_samtools_stringtie_folder:
    in:
      item:
      - star_samtools_stringtie_1/stringtie_out
      - star_samtools_stringtie_2/stringtie_out
      - star_samtools_stringtie_3/stringtie_out
      - star_samtools_stringtie_4/stringtie_out
      name:
        valueFrom: star_samtools_stringtie
    out:
    - out
    run: /data/tony/RNASeq/cwl-tools/folder.cwl
  star_samtools_stringtie_prepde:
    in:
      input_script: prepDE_script
      stringtie_out:
      - star_samtools_stringtie_1/stringtie_out
      - star_samtools_stringtie_2/stringtie_out
      - star_samtools_stringtie_3/stringtie_out
      - star_samtools_stringtie_4/stringtie_out
    out:
    - gene_output
    - transcript_output
    run: /data/tony/RNASeq/cwl-tools/docker/prepDE.cwl
  star_samtools_stringtie_prepde_deseq2:
    in:
      count_matrix: star_samtools_stringtie_prepde/gene_output
      input_script: DESeq2_script
      metadata: metadata
    out:
    - DESeq2_out
    run: /data/tony/RNASeq/cwl-tools/docker/DESeq2.cwl
  star_samtools_stringtie_prepde_deseq2_folder:
    in:
      item: star_samtools_stringtie_prepde_deseq2/DESeq2_out
      name:
        valueFrom: star_samtools_stringtie_prepde_deseq2
    out:
    - out
    run: /data/tony/RNASeq/cwl-tools/folder.cwl
